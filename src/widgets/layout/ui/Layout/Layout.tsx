import { Children, cloneElement, isValidElement } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  owner: string;
  repo: string;
}

export const Layout = ({ children, owner, repo }: LayoutProps) => {
  return (
    <>
      {Children.map(children, (child) => {
        return isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ owner: string; repo: string }>, {
              owner,
              repo,
            })
          : child;
      })}
    </>
  );
};
