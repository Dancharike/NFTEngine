export enum Anchor
{
    TopLeft, TopCenter, TopRight,
    MiddleLeft, MiddleCenter, MiddleRight,
    BottomLeft, BottomCenter, BottomRight
}

export function resolveAnchor(anchor: Anchor, screenWidth: number, screenHeight: number): {x: number, y: number}
{
    const hw = screenWidth / 2;
    const hh = screenHeight / 2;

    switch(anchor)
    {
        case Anchor.TopLeft:      return {x: -hw, y:  hh};
        case Anchor.TopCenter:    return {x:   0, y:  hh};
        case Anchor.TopRight:     return {x:  hw, y:  hh};
        case Anchor.MiddleLeft:   return {x: -hw, y:   0};
        case Anchor.MiddleCenter: return {x:   0, y:   0};
        case Anchor.MiddleRight:  return {x:  hw, y:   0};
        case Anchor.BottomLeft:   return {x: -hw, y: -hh};
        case Anchor.BottomCenter: return {x:   0, y: -hh};
        case Anchor.BottomRight:  return {x:  hw, y: -hh};
    }
}
