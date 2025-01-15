import { ReactNode } from 'react';

interface LayoutPublicProps {
  children: ReactNode,
}

const LayoutPublic: React.FC<LayoutPublicProps> = async ({ children }) => {
  return (
    <>
      <header>Some header</header>
      <nav>Public Navigation</nav>
      <main>
        {children}
      </main>
      <footer>Footer</footer>
    </>
  );
};

export default LayoutPublic;
