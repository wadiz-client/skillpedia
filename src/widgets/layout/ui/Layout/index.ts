import { Content } from './Content';
import { Footer } from './Footer';
import { Header } from './Header';
import { Layout as InternalLayout } from './Layout';

export const Layout = Object.assign(InternalLayout, {
  Content,
  Footer,
  Header,
});
