import p5 from "p5";
import "lodash";

const PHI = ( 1.0 + Math.sqrt(5) ) / 2.0;

function convertToRad(d: number): number {
  return (d * Math.PI) / 180
}

function convertToKey(n: number): number {
  return Math.round((n - 0.35) / 0.7)
}

interface Coordinate {
  x: number
  y: number
}

interface Edge {
  startVertex?: Vertex
  endVertex?: Vertex
  length: number
}

interface Template {
  name: string
  elements: (Vertex | Edge)[]
}

interface Shape {
  template: Template
  keyVertex: Vertex
  orientation: number
}

interface Vertex {
  shape?: Shape
  open: boolean
  beforeEdge?: Edge
  afterEdge?: Edge
  cell?: Cell
  degreesCovered: number
}

interface Cell {
  locationKey: Coordinate
  vertexLocation: Coordinate
  freeDegrees: number
  enabled: boolean
} // a cell is a region of the canvas indexed by its center point
// the cellspace maps directly to the mathspace such that each
// cell width/height is 0.7 mathunits, which are then scaled up
// to the canvas space units

const templates = () => {
  const presult: Array<Template> = [
    {
      name: 'kite',
      elements: [
        { open: false, degreesCovered: 72 } as Vertex,
        { length: 1 } as Edge,
        { open: true, degreesCovered: 144 } as Vertex,
        { length: 1 } as Edge,
        { open: false, degreesCovered: 72 } as Vertex,
        { length: PHI } as Edge,
        { open: true, degreesCovered: 72 } as Vertex,
        { length: PHI } as Edge,
      ]
    },
    {
      name: 'dart',
      elements: [
        { open: true, degreesCovered: 36 } as Vertex,
        { length: PHI } as Edge,
        { open: false, degreesCovered: 72 } as Vertex,
        { length: PHI } as Edge,
        { open: true, degreesCovered: 36 } as Vertex,
        { length: 1 } as Edge,
        { open: false, degreesCovered: 216 } as Vertex,
        { length: 1 } as Edge,
      ]
    }
  ]
  // time to link up the edges and vertices
  const result = presult.map(v => {
    v.elements = v.elements.map((vv, i, a) => {
      const prevIndex = (i + 7) % 8;
      const nextIndex = (i + 1) % 8;
      if ("beforeEdge" in vv) { // it's a vertex
        vv.beforeEdge = a[prevIndex] as Edge;
        vv.afterEdge = a[nextIndex] as Edge;
      } else if ("startVertex" in vv) { // it's an edge
        vv.startVertex = a[prevIndex] as Vertex;
        vv.endVertex = a[nextIndex] as Vertex;
      } else {
        // freak the hell out
        console.log("Universe broken, please reboot");
      }
      return vv
    });
  });
  return result
}

// shape angles are measured ANTI-CLOCKWISE from the direction of travel of the pen
// orientation angles are measured CLOCKWISE from the line x = c

const findNextCoord = function(startVertex: Vertex, orientation: number): Coordinate {
  const newOrientation = (360 + orientation - startVertex.degreesCovered) % 360;
  if (startVertex.afterEdge) {
    return {
      x: startVertex.afterEdge.length * Math.cos(convertToRad(newOrientation)),
      y: startVertex.afterEdge.length * Math.sin(convertToRad(newOrientation))
    } as Coordinate
  } else {
    console.log("findNextCoord: startVertex missing afterEdge")
  }
  return {x:0,y:0} as Coordinate
}

const sketch = p => {

  p.setup = () => {
    const maxPixels: Coordinate = {x: 400, y: 400}
    const pixelsPerCell = 200
    const offset: Coordinate = {x: Math.round(maxPixels.x / 2), y: Math.round(maxPixels.y / 2)}

    p.createCanvas(maxPixels.x, maxPixels.y)
  }

  p.draw = () => {

  }

};

let pfive = new p5(sketch);