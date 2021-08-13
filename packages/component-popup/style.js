/* stylelint-disable value-keyword-case */
import styled from 'styled-components'

export const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(props) => props.zIndex};
  background: rgba(0, 0, 0, 0.7);
`

export const Container = styled.div((props) => {
  const style = {
    background: '#fff',
  }
  // 判断方向
  const { position, width, height, round } = props

  if (position === 'top' || position === 'bottom') {
    style.width = '100%'
    style.height = height
    if (round) {
      style[`border-${position}-left-radius`] = 6
      style[`border-${position}-right-radius`] = 6
    }
  } else {
    style.width = width
    style.height = '100%'
    if (round) {
      style[`border-top-${position}-radius`] = 6
      style[`border-bottom-${position}-radius`] = 6
    }
  }

  return style
})
