// popup
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { Mask, Container } from './style'

const PopUp = ({ zIndex, ...rest }) => {
  useEffect(() => {
    return () => {}
  }, [])
  return createPortal(
    <Mask zIndex={zIndex}>
      <Container {...rest}>111</Container>
    </Mask>,
    document.body,
  )
}

PopUp.defaultProps = {
  width: 200,
  height: 200,
  round: false,
  position: 'bottom',
  zIndex: 100,
}

PopUp.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  round: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  zIndex: PropTypes.number,
}

export default PopUp
