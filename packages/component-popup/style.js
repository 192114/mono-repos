import styled from 'styled-components'

export const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(props) => props.zindex};
  background: rgba(0, 0, 0, 0.7);
`

export const Container = styled.div`
  width: ${(props) => props.width};
`
