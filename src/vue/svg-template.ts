import * as prettier from 'prettier';

export const getSvgComponent = (iconInfo: any, svgContent: string, style: string): { componentName: string, fileContent: string } => {
  const componentName = getIconComponentName(iconInfo.code);

  const fileContent = `<script setup lang="ts">
  import Icon from '@ant-design/icons-vue';
  </script>
  
  <template>
    <icon>
      <template #component>
        ${svgContent.replace('style=""', `style="${style}"`)}
      </template>
    </icon>
  </template>';
`;

  const formatted = prettier.format(
    fileContent,
    {
      parser: 'vue',
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
