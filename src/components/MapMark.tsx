import React, { memo } from 'react';

/**
 * 地图标记组件（轻量展示）
 *
 * 说明：OpenMap 组件内部使用矢量要素渲染标记；
 * 本组件用于在列表、道具面板或测试时以 DOM 形式显示标记信息并响应用户交互。
 */
export interface MapMarkProps {
  /** 原始坐标（经度，经度或地图投影坐标） */
  coordinates: [number, number] | number[];
  /** 标记名称 */
  name: string;
  /** 分类（可选） */
  category?: string;
  /** 标识符 */
  id: string | number;
  /** 点击回调 */
  onClick?: (id: string | number) => void;
  /** 是否可见 */
  visible?: boolean;
  /** 图标大小（像素） */
  size?: number;
  /** 额外 className */
  className?: string;
}

const defaultSize = 28;

const MapMark: React.FC<MapMarkProps> = ({
  coordinates,
  name,
  category,
  id,
  onClick,
  visible = true,
  size = defaultSize,
  className,
}) => {
  if (!visible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(id);
    }
  };

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
  };

  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: '#1890ff',
    display: 'inline-block',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    flex: '0 0 auto',
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      aria-label={String(name)}
      onClick={handleClick}
      className={className}
      style={style}
      data-id={id}
      data-coordinates={JSON.stringify(coordinates)}
      data-category={category}
    >
      <span style={iconStyle} />
      <span style={{ fontSize: 12, color: '#222' }}>{name}</span>
    </div>
  );
};

export default memo(MapMark);
