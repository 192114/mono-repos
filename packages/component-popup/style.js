/* stylelint-disable value-keyword-case */
import styled from 'styled-components'

const radiusValue = 18

export const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(props) => props.zIndex};
  background: rgba(0, 0, 0, 0.8);
`

export const Container = styled.div((props) => {
  // 判断方向
  const { position, width, height, round } = props

  const style = {
    background: '#fff',
    padding: 16,
    boxSizing: 'border-box',
    position: 'absolute',
    [position]: 0,
    transition: 'transform 0.2s ease',
  }

  if (position === 'top' || position === 'bottom') {
    style.width = '100%'
    style.height = height
    style.transform = position === 'top' ? 'translate(0, -100%)' : 'translate(0, 100%)'
    if (round) {
      const nextPos = position === 'top' ? 'bottom' : 'top'
      style[`border-${nextPos}-left-radius`] = radiusValue
      style[`border-${nextPos}-right-radius`] = radiusValue
    }
  } else {
    style.width = width
    style.height = '100%'
    style.transform = position === 'left' ? 'translate(-100%, 0)' : 'translate(100%, 0)'
    if (round) {
      const nextPos = position === 'left' ? 'right' : 'left'
      style[`border-top-${nextPos}-radius`] = radiusValue
      style[`border-bottom-${nextPos}-radius`] = radiusValue
    }
  }

  return style
})
