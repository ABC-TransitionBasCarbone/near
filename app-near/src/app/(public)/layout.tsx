import { ReactNode } from 'react';
import LayoutPublic from '../_components/layouts/LayoutPublic';

interface PublicLayoutProps {
  children: ReactNode
}
const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => (
  <LayoutPublic>
    {children}
  </LayoutPublic>
);

export default PublicLayout;
