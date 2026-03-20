import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Segmented,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useGetCategoriesQuery, useGetProductsQuery } from "../app/api/catalogApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addToCart, decreaseQuantity, increaseQuantity } from "../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import type { ProductResponse } from "@lab1_2/types";

export default function CatalogPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");

  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();

  const cartItems = useAppSelector((state) => state.cart.items);

  const quantities = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.product.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    const list = products ?? [];
    return list.filter((product) => {
      const matchesCategory =
        categoryId === "all" || product.category_id === categoryId;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryId, search]);

  const renderControls = (product: ProductResponse) => {
    const quantity = quantities[product.id] ?? 0;

    if (quantity === 0) {
      return (
        <Button
          type="primary"
          block
          icon={<PlusOutlined />}
          onClick={() => {
            dispatch(addToCart(product));
            message.success("Добавлено в корзину");
          }}
        >
          В корзину
        </Button>
      );
    }

    return (
      <Space.Compact style={{ width: "100%" }}>
        <Button
          icon={<MinusOutlined />}
          onClick={() => dispatch(decreaseQuantity(product.id))}
        />
        <Button style={{ flex: 1 }} onClick={() => navigate("/cart")}>
          {quantity} в корзине
        </Button>
        <Button
          icon={<PlusOutlined />}
          onClick={() => dispatch(increaseQuantity(product.id))}
        />
      </Space.Compact>
    );
  };

  return (
    <div>
      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", marginBottom: 20 }}
      >
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Каталог
        </Typography.Title>
        <Typography.Text type="secondary">
          Оранжевый, чистый и максимально удобный интерфейс
        </Typography.Text>

        <Input.Search
          allowClear
          size="large"
          placeholder="Поиск товара"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Segmented
          value={categoryId}
          onChange={(value) => setCategoryId(String(value))}
          options={[
            { label: "Все", value: "all" },
            ...(categories ?? []).map((c) => ({ label: c.name, value: c.id })),
          ]}
        />
      </Space>

      {(categoriesLoading || productsLoading) && (
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      )}

      {!productsLoading && filteredProducts.length === 0 && <Empty />}

      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Card
              hoverable
              style={{
                height: "100%",
                borderRadius: 20,
                borderColor: "#fde3c3",
              }}
              title={
                <Space>
                  <Badge color="#fa8c16" />
                  <Typography.Text strong>{product.name}</Typography.Text>
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                  {product.description ?? "Описание отсутствует"}
                </Typography.Paragraph>

                <Typography.Title level={4} style={{ margin: 0, color: "#d46b08" }}>
                  {product.price.toLocaleString()} ₽
                </Typography.Title>

                {renderControls(product)}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}