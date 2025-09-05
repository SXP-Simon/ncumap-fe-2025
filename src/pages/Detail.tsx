import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const Detail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        返回
      </Button>
      <h1>详情页面</h1>
      <p>位置ID: {id}</p>
      <p>这里将显示具体的位置详情信息</p>
    </div>
  );
};

export default Detail;
