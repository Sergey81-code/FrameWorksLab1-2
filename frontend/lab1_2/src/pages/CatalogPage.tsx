import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  message,
  TreeSelect,
  Carousel,
  Image,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductPhotosQuery,
} from "../app/api/catalogApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import type { Category, ProductResponse } from "@lab1_2/types";

interface TreeNode {
  title: string;
  value: string;
  key: string;
  children?: TreeNode[];
}

function ProductCard({
  product,
  children,
}: {
  product: ProductResponse;
  children: React.ReactNode;
}) {
  const { data: photos = [] } = useGetProductPhotosQuery(product.id);


  return (
    <Card
      hoverable
      style={{
        height: "100%",
        borderRadius: 20,
        borderColor: "#fde3c3",
      }}
      cover={
        photos.length > 0 ? (
        <Carousel dots>
          {photos.map((photo, index) => (
            <Image
              key={index}
              src={`http://localhost:8082/product_photos/${photo}`}
              alt={product.name}
              style={{ height: 200, objectFit: "cover" }}
              preview={false}
            />
          ))}
        </Carousel>
        ) : (
          <div style={{ height: 200, background: "#f5f5f5" }} />
        )
      }
      title={
        <Space>
          <Badge color="#fa8c16" />
          <Typography.Text strong>{product.name}</Typography.Text>
        </Space>
      }
    >
      {children}
    </Card>
  );
}

export default function CatalogPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");

  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: products, isLoading: productsLoading } =
    useGetProductsQuery();

  const cartItems = useAppSelector((state) => state.cart.items);

  const quantities = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.product.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const buildCategoryTree = (categories: Category[]) => {
    const map: Record<string, Category & { children: Category[] }> = {};
    const roots: (Category & { children: Category[] })[] = [];

    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parent_id && map[cat.parent_id]) {
        map[cat.parent_id].children.push(map[cat.id]);
      } else {
        roots.push(map[cat.id]);
      }
    });

    return roots;
  };

  const treeData: TreeNode[] = useMemo(() => {
    if (!categories) return [];

    const mapNode = (
      cat: Category & { children: Category[] }
    ): TreeNode => ({
      title: cat.name,
      value: cat.id,
      key: cat.id,
      children:
        cat.children && cat.children.length > 0
          ? cat.children.map((child) => mapNode(child as Category & { children: Category[] }))
          : undefined,
    });

    return [
      { title: "Все", value: "all", key: "all" },
      ...buildCategoryTree(categories).map(mapNode),
    ];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const list = products ?? [];

    const selectedCategoryIds = new Set<string>();
    const collectIds = (catId: string) => {
      selectedCategoryIds.add(catId);
      categories
        ?.filter((c) => c.parent_id === catId)
        .forEach((child) => collectIds(child.id));
    };
    if (categoryId && categoryId !== "all") collectIds(categoryId);

    return list.filter((product) => {
      const matchesCategory =
        categoryId === "all" ||
        (product.category_id !== null &&
          selectedCategoryIds.has(product.category_id));
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryId, search, categories]);

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

        <Input.Search
          allowClear
          size="large"
          placeholder="Поиск товара"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TreeSelect
          style={{ width: "100%" }}
          value={categoryId}
          onChange={(value) => setCategoryId(String(value))}
          treeData={treeData}
          placeholder="Выберите категорию"
          allowClear
          treeDefaultExpandAll
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
            <ProductCard product={product}>
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                  {product.description ?? "Описание отсутствует"}
                </Typography.Paragraph>

                <Typography.Title level={4} style={{ margin: 0, color: "#d46b08" }}>
                  {product.discount ? (
                    <span>
                      <Typography.Text delete style={{ marginRight: 8 }}>
                        {Math.floor(Number(product.price)).toLocaleString("ru-RU")} ₽
                      </Typography.Text>
                      <Typography.Text strong>
                        {Math.floor(
                          Number(product.price) *
                            (1 - product.discount / 100)
                        ).toLocaleString("ru-RU")} ₽
                      </Typography.Text>
                    </span>
                  ) : (
                    <span>
                      {Math.floor(Number(product.price)).toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </Typography.Title>

                {renderControls(product)}
              </Space>
            </ProductCard>
          </Col>
        ))}
      </Row>
    </div>
  );
}