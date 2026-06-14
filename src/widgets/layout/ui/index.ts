import { Content } from './Content';
import { Header } from './Header';
import { Layout as InternalLayout } from './Layout';

type CompoundedLayoutType = typeof InternalLayout & {
  Content: typeof Content;
  Header: typeof Header;
};

const CompoundedLayout = InternalLayout as CompoundedLayoutType;

CompoundedLayout.Header = Header;
CompoundedLayout.Content = Content;

export const Layout = CompoundedLayout;
