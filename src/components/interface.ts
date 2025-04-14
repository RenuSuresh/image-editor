interface IIconProps {
    [x: string]: any;
    color?: string;
    width?: string;
    height?: string;
  }


interface IPoint {
    x: number;
    y: number;
}
interface ICropRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

  export type {IIconProps,IPoint,ICropRect}