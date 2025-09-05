import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Image, Spin, Alert, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useBuildingDetail } from '../hooks';

const { Title, Paragraph, Text } = Typography;

const Detail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { building, loading, error } = useBuildingDetail(id);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Button 
          icon={<LeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: '20px' }}
        >
          返回
        </Button>
        <Alert message="加载失败" description={error} type="error" />
      </div>
    );
  }

  if (!building) {
    return (
      <div style={{ padding: '20px' }}>
        <Button 
          icon={<LeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: '20px' }}
        >
          返回
        </Button>
        <Alert message="未找到相关信息" type="warning" />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F2F8FA'}}>
      {/* 顶部返回按钮 */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000 
      }}>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px'
          }}
        />
      </div>

      {/* 头部封面图片和标题 */}
      <div style={{ position: 'relative', height: '296px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            backgroundImage: `linear-gradient(to top, #F2F8FA 0%, transparent 50%, transparent 50%), url(${building.cover || '/map-cut.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '20px'
          }}
        >
          <Title level={1} style={{ color: '#164CD7', margin: 0, fontSize: '32px' }}>
            {building.name}
          </Title>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: '20px' }}>
        {/* 基本信息 */}
        <Card style={{ marginBottom: '16px', backgroundColor: '#F2F8FA', border: 'none' }}>
          <Paragraph style={{ color: '#3A5A8A', fontSize: '16px' }}>
            {building.info}
          </Paragraph>
          
          {/* 信息提示卡片 */}
          {building.tips.info?.map((tip, index) => (
            <Card key={index} style={{ marginTop: '16px' }}>
              <Title level={5}>{tip.title}</Title>
              {tip.content.map((content, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </Card>
          ))}
        </Card>

        {/* 基本职能 */}
        <Card style={{ marginBottom: '16px' }}>
          <Card.Meta
            avatar={<img src="/icons/基本职能.svg" alt="基本职能" style={{ width: '24px' }} />}
            title={<Text style={{ color: '#123871', fontSize: '18px', fontWeight: 'bold' }}>基本职能</Text>}
          />
          <div style={{ marginTop: '16px' }}>
            {building.functions && building.functions.length > 0 ? (
              building.functions.map((func, index) => (
                <Paragraph key={index}>{func}</Paragraph>
              ))
            ) : (
              <Text type="secondary">暂无</Text>
            )}
          </div>
          
          {/* 职能提示卡片 */}
          {building.tips.functions?.map((tip, index) => (
            <Card key={index} style={{ marginTop: '16px' }}>
              <Title level={5}>{tip.title}</Title>
              {tip.content.map((content, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </Card>
          ))}
        </Card>

        {/* 学院办公点 */}
        <Card style={{ marginBottom: '16px' }}>
          <Card.Meta
            avatar={<img src="/icons/学院办公点.svg" alt="学院办公点" style={{ width: '24px' }} />}
            title={<Text style={{ color: '#123871', fontSize: '18px', fontWeight: 'bold' }}>学院办公点</Text>}
          />
          <div style={{ marginTop: '16px' }}>
            {building.offices && building.offices.length > 0 ? (
              building.offices.map((office, index) => (
                <Paragraph key={index}>{office}</Paragraph>
              ))
            ) : (
              <Text type="secondary">暂无</Text>
            )}
          </div>
          
          {/* 办公点提示卡片 */}
          {building.tips.offices?.map((tip, index) => (
            <Card key={index} style={{ marginTop: '16px' }}>
              <Title level={5}>{tip.title}</Title>
              {tip.content.map((content, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </Card>
          ))}
        </Card>

        {/* 其他 */}
        <Card style={{ marginBottom: '16px' }}>
          <Card.Meta
            avatar={<img src="/icons/其他.svg" alt="其他" style={{ width: '24px' }} />}
            title={<Text style={{ color: '#123871', fontSize: '18px', fontWeight: 'bold' }}>其他</Text>}
          />
          <div style={{ marginTop: '16px' }}>
            {building.activities && building.activities.length > 0 ? (
              building.activities.map((activity, index) => (
                <Paragraph key={index}>{activity}</Paragraph>
              ))
            ) : (
              <Text type="secondary">暂无</Text>
            )}
          </div>
          
          {/* 活动提示卡片 */}
          {building.tips.activities?.map((tip, index) => (
            <Card key={index} style={{ marginTop: '16px' }}>
              <Title level={5}>{tip.title}</Title>
              {tip.content.map((content, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: content }} />
              ))}
            </Card>
          ))}
        </Card>

        {/* 图片展示 */}
        {building.imgs && building.imgs.length > 0 && (
          <Card style={{ marginBottom: '16px' }}>
            <Image.PreviewGroup>
              {building.imgs.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  style={{ 
                    margin: '10px', 
                    maxWidth: '100%', 
                    borderRadius: '8px' 
                  }}
                />
              ))}
            </Image.PreviewGroup>
          </Card>
        )}

        {/* 底部链接 */}
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          进入
          <a 
            href="https://aiguide.ncuos.com/welcome" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ margin: '0 4px' }}
          >
            漫游指北
          </a>
          了解更多
        </div>
      </div>
    </div>
  );
};

export default Detail;
