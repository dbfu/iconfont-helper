export interface Icon {
  id: string;
  name: string;
  svgContent: string;
  code: string;
}

export interface EventData {
  active: 'local' | 'project' | 'favorite' | 'antd',
  icon: {
    id: string;
    svg: string;
    style: string;
  }
}

export interface EventMessage {
  type: 'select';
  data: EventData;
}