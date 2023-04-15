import * as prettier from 'prettier';

export const getSvgComponent = (iconInfo: any, svgContent: string, style: string): { componentName: string, fileContent: string } => {
  const componentName = getIconComponentName(iconInfo.code);
  const svgName = getIconSvgName(iconInfo.code);

  const fileContent = `import Icon from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const ${svgName} = () => (
  ${svgContent.trim().replace('style=""', `style={${JSON.stringify(formatStyle(style), null, 0)}}`)}
);

export const ${componentName} = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={${svgName}} {...props} />
)`;

  const formatted = prettier.format(
    fileContent,
    {
      parser: 'babel',
      trailingComma: 'all',
    }
  );

  return {
    componentName,
    fileContent: formatted,
  };
};

export const getIconSvgName = (name: string) => {
  const iconName = getIconName(name);
  const componentName = `SVG${iconName}`;
  return componentName;
};

export const getIconComponentName = (name: string) => {
  const iconName = getIconName(name);
  const componentName = `Icon${iconName}`;
  return componentName;
};

export const getIconName = (name: string) => {
  return name
    .replace(/[^a-zA-Z0-9_]/g, '')
    .split('')
    .map((c: string, index: number) => index === 0 ? c.toUpperCase() : c)
    .join('');
};

const formatStyleKey = (styleKey: string) => {
  const keys = styleKey.trim().split('-');
  const first = keys.shift();
  const result = [
    first,
    ...keys.map(key => key.split('').map((v: string, i: number) => i === 0 ? v.toUpperCase() : v).join(''))
  ].join('');
  return result;
};

const formatStyle = (style: string) => {
  if (!style) {
    return {};
  }

  const result = style.split(';')
    .filter(o => o)
    .reduce((prev: any, cur) => {
      const [key, value] = cur.split(':');
      prev[formatStyleKey(key)] = value.trim();
      return prev;
    }, {});

  return result;
};
