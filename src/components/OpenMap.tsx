import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { Select } from 'ol/interaction';
import { click } from 'ol/events/condition';
import { Projection } from 'ol/proj';
import { mincu } from 'mincu-vanilla';
import axios from 'axios';

interface OpenMapProps {
  x: number;
  y: number;
  onFeatureSelected?: (locationId: string) => void;
}

export interface OpenMapRef {
  currentZoom: number;
  currentCenter: number[];
  categories: string[];
  currentCategory: number;
  marks: any;
  viewTo: (coordinates: number[]) => void;
  zoomTo: (zoom: number) => void;
  backToCenter: () => void;
  locate: () => void;
  showAllMarks: () => void;
}

const convertCoordinates = (coordinates: number[]) => {
  const top = 28.66776098033687;
  const bottom = 28.641503853212868;
  const right = 115.81343996831613;
  const left = 115.78972714948839;
  const blank = 27.8;
  const unitY = (top - bottom) / 256;
  const unitX = (right - left) / (256 - 2 * blank);
  const result = [(coordinates[0] - left) / unitX + blank, (coordinates[1] - bottom) / unitY];

  // 确保坐标是有效数字
  if (isNaN(result[0]) || isNaN(result[1])) {
    console.warn('Invalid coordinates:', coordinates, 'converted to:', result);
    return [128, 128]; // 返回地图中心作为默认值
  }

  return result;
};

const OpenMap = forwardRef<OpenMapRef, OpenMapProps>(({ x, y, onFeatureSelected }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const viewRef = useRef<View | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  
  const [centerX, centerY] = convertCoordinates([x, y]);
  
  const currentZoom = useRef(3);
  const currentCenter = useRef([centerX, centerY]);
  const categories = useRef(['全部', '活动']);
  // 用 ref 保存当前分类索引（避免频繁重渲染），若需要响应式更新再添加 state
  const currentCategory = useRef(0);
  const marks = useRef<any>(null);
  const geoLocationMark = useRef<number[]>([]);

  const fetcher = axios.create();
  mincu.useAxiosInterceptors(fetcher);

  const baseURL = 'https://ncumap-be.ncuos.com';

  const size = [256, 256];
  const extent = [0, 0, ...size];

  // 创建自定义投影
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent: extent,
  });

  const isInSchool = ([x, y]: number[]) => {
    if (x > 256 || y > 256 || x < 0 || y < 0) {
      return false;
    }

    const outterRadius = 338.903773758;
    const outterPosition = [358.719676797, 256 - 267.353227436];
    const innerRadius = 139.212193554;
    const innerPosition = [237.606831329, 256 - 230.578642916];

    const distance = ([x1, y1]: number[], [x2, y2]: number[]) => {
      return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    };

    return distance([x, y], outterPosition) < outterRadius && distance([x, y], innerPosition) > innerRadius;
  };

  const geoSuccess = (position: any) => {
    let [centerX, centerY] = convertCoordinates([position.lng, position.lat]);

    if (isInSchool([centerX, centerY])) {
      geoLocationMark.current = [centerX, centerY];
      currentCenter.current = [centerX, centerY];
      if (viewRef.current) {
        viewRef.current.setCenter([centerX, centerY]);
      }
      updateLocationMarker();
    } else {
      mincu.toast.info(`位于校外`);
      viewTo([115.804362, 28.663298]);
    }
  };

  const locate = () => {
    // 使用浏览器原生定位API作为备选方案
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          geoSuccess({
            lng: position.coords.longitude,
            lat: position.coords.latitude
          });
        },
        (error) => {
          console.error('定位失败:', error);
          // mincu.toast 可能不包含 error 方法，使用 fail 如果可用，否则回退到 info
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (mincu?.toast?.fail) mincu.toast.fail('定位失败');
          else mincu.toast.info('定位失败');
        }
      );
    }
  };

  const viewTo = (coordinates: number[]) => {
    if (viewRef.current) {
      viewRef.current.setCenter(convertCoordinates(coordinates));
    }
  };

  const zoomTo = (zoom: number) => {
    if (viewRef.current) {
      viewRef.current.setZoom(zoom);
    }
  };

  const backToCenter = () => {
    if (viewRef.current) {
      viewRef.current.setCenter([centerX, centerY]);
    }
  };

  const showAllMarks = () => {
    currentCategory.current = 0;
    updateMarkers();
  };

  const updateLocationMarker = () => {
    if (!vectorSourceRef.current) return;

    // 清除现有的定位标记
    const features = vectorSourceRef.current.getFeatures();
    features.forEach(feature => {
      if (feature.get('type') === 'location') {
        vectorSourceRef.current!.removeFeature(feature);
      }
    });

    // 添加新的定位标记
    if (geoLocationMark.current.length > 0) {
      const locationFeature = new Feature({
        geometry: new Point(geoLocationMark.current),
        type: 'location'
      });
      
      locationFeature.setStyle(new Style({
        image: new Icon({
          src: '/flag.svg',
          anchor: [0.5, 1]
        })
      }));

      vectorSourceRef.current.addFeature(locationFeature);
    }
  };

  const updateMarkers = () => {
    if (!vectorSourceRef.current || !marks.current) return;

    // 清除现有标记（除了定位标记）
    const features = vectorSourceRef.current.getFeatures();
    features.forEach(feature => {
      if (feature.get('type') !== 'location') {
        vectorSourceRef.current!.removeFeature(feature);
      }
    });

    // 添加新标记
    const categoriesToShow = currentCategory.current === 0 || currentCategory.current === 1 
      ? categories.current.slice(2) // 跳过 '全部' 和 '活动'
      : [categories.current[currentCategory.current]];

    categoriesToShow.forEach(category => {
      if (marks.current[category]) {
        marks.current[category].forEach((mark: any) => {
          if (mark.priority <= currentZoom.current) {
            const feature = new Feature({
              geometry: new Point(convertCoordinates(mark.coordinates)),
              name: mark.name,
              category: category,
              id: mark.location_id,
              type: 'marker'
            });

            feature.setStyle(new Style({
              image: new Icon({
                src: `/images/marks/${category}/${mark.location_id}.svg`,
                scale: 1.3,
                anchor: [0.2, 1]
              })
            }));

            vectorSourceRef.current!.addFeature(feature);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const view = new View({
      center: [centerX, centerY],
      zoom: 3,
      projection: projection,
      enableRotation: false,
      maxZoom: 6,
      minZoom: 0,
      extent: extent,
      constrainOnlyCenter: true
    });

    viewRef.current = view;

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: '/tiles/{z}/tile_{x}_{y}.png',
            projection: projection,
          }),
        }),
        vectorLayer
      ],
      view: view,
      controls: []
    });

  // 添加点击交互
    const selectInteraction = new Select({
      condition: click,
      filter: (feature) => {
        return feature.get('name') !== undefined && feature.get('type') === 'marker';
      }
    });

    selectInteraction.on('select', (event) => {
      const selectedFeatures = event.selected;
      if (selectedFeatures.length > 0) {
        const feature = selectedFeatures[0];
  const geometry = feature.getGeometry();
  // geometry 可能是多种类型，断言为 Point 以调用 getCoordinates
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const coordinates = geometry?.getCoordinates ? geometry.getCoordinates() : undefined;
        if (coordinates && viewRef.current) {
          viewRef.current.setCenter(coordinates);
        }
        if (onFeatureSelected && feature.get('id')) {
          onFeatureSelected(feature.get('id'));
        }
      }
    });

  map.addInteraction(selectInteraction);

    // 监听视图变化（保存 handler 引用便于卸载）
    const onResolutionChange = () => {
      currentZoom.current = view.getZoom() || 3;
      updateMarkers();
    };

    const onCenterChange = () => {
      currentCenter.current = view.getCenter() || [centerX, centerY];
    };

    view.on('change:resolution', onResolutionChange);
    view.on('change:center', onCenterChange);

  mapInstanceRef.current = map;

    // 初始化数据
    const initializeData = async () => {
      try {
        locate();
        const response = await fetcher.get(baseURL + '/api/v1/campus/marks');
        marks.current = response.data;
        categories.current.push(...Object.keys(marks.current));
        updateMarkers();
      } catch (err) {
        console.error('Failed to load map data:', err);
      }
    };

    initializeData();

    return () => {
      // 清理交互与事件监听，销毁 map
      try {
        view.un('change:resolution', onResolutionChange);
        view.un('change:center', onCenterChange);
      } catch (e) {
        // ignore
      }

      try {
        map.removeInteraction(selectInteraction);
      } catch (e) {
        // ignore
      }

      if (map) {
        map.setTarget(undefined);
      }

      vectorSourceRef.current = null;
      mapInstanceRef.current = null;
      viewRef.current = null;
    };
  }, []);
  // 注意：currentCategory 使用 ref 存储，若需要在分类变化时自动更新视图，请把 currentCategory 改为 state。

  useImperativeHandle(ref, () => ({
    currentZoom: currentZoom.current,
    currentCenter: currentCenter.current,
    categories: categories.current,
    currentCategory: currentCategory.current,
    marks: marks.current,
    viewTo,
    zoomTo,
    backToCenter,
    locate,
    showAllMarks
  }));

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
});

OpenMap.displayName = 'OpenMap';

export default OpenMap;
