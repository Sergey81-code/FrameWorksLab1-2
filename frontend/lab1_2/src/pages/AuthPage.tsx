import {
  Avatar,
  Button,
  Drawer,
  Layout,
  Menu,
  Space,
  Typography,
  Grid,
} from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, setUser } from "../app/slices/authSlice";
import { useGetMeQuery } from "../app/api/userApi";

const { Header, Content, Footer, Sider } = Layout;

export default function AppLayout() {
  const { md } = Grid.useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.accessToken);
  const currentUser = useAppSelector((state) => state.auth.user);

  const { data: me } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (me) dispatch(setUser(me));
  }, [me, dispatch]);

  const items = useMemo(
    () => [
      { key: "/catalog", label: "Каталог", icon: <AppstoreOutlined /> },
      { key: "/cart", label: "Корзина", icon: <ShoppingCartOutlined /> },
      { key: "/profile", label: "Профиль", icon: <UserOutlined /> },
    ],
    []
  );

  const selectedKey = location.pathname.startsWith("/profile")
    ? "/profile"
    : location.pathname.startsWith("/cart")
    ? "/cart"
    : "/catalog";

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={items}
      onClick={(e) => {
        navigate(e.key);
        setDrawerOpen(false);
      }}
      style={{ borderInlineEnd: 0 }}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {md ? (
        <Sider
          width={240}
          style={{
            background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)",
            borderRight: "1px solid #fde3c3",
          }}
        >
          <div style={{ padding: 24 }}>
            <Typography.Title level={3} style={{ margin: 0, color: "#d46b08" }}>
              Orange Shop
            </Typography.Title>
            <Typography.Text type="secondary">
              clean, fast, responsive
            </Typography.Text>
          </div>
          {menu}
        </Sider>
      ) : (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          width={280}
          title="Orange Shop"
        >
          {menu}
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Space>
            {!md && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
              />
            )}
            <Typography.Title level={4} style={{ margin: 0, color: "#d46b08" }}>
              Orange Shop
            </Typography.Title>
          </Space>

          <Space>
            {currentUser ? (
              <>
                <Avatar
                  src={currentUser.avatar}
                  icon={!currentUser.avatar ? <UserOutlined /> : undefined}
                />
                <Typography.Text strong>
                  {currentUser.name ?? currentUser.email}
                </Typography.Text>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    dispatch(logout());
                    navigate("/auth");
                  }}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <Button icon={<LoginOutlined />} onClick={() => navigate("/auth")}>
                Войти
              </Button>
            )}
          </Space>
        </Header>

        <Content style={{ padding: md ? 24 : 12 }}>
          <div
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              background: "transparent",
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center", color: "#8c8c8c" }}>
          Orange Shop ©2026
        </Footer>
      </Layout>
    </Layout>
  );
}