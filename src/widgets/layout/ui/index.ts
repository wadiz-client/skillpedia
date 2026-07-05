import { Content } from './Content';
import { Footer } from './Footer';
import { Header } from './Header';
import { Layout as InternalLayout } from './Layout';

type CompoundedLayoutType = typeof InternalLayout & {
  Content: typeof Content;
  Footer: typeof Footer;
  Header: typeof Header;
};

const CompoundedLayout = InternalLayout as CompoundedLayoutType;

CompoundedLayout.Header = Header;
CompoundedLayout.Content = Content;
CompoundedLayout.Footer = Footer;

export const Layout = CompoundedLayout;
