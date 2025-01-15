import { ReactNode } from 'react';

export const renderIcon = (icon: string|ReactNode, iconSize: number = 16, alt = 'icon'): ReactNode => {
  if (!icon) {
    return null;
  }
  if (typeof icon === 'string') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} alt={alt} width={iconSize} height={iconSize} />;
  }
  return icon;
};
