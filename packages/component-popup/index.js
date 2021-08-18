// popup
import React, { useEffect, useRef, useState } from 'react'
import { createPortal, unmountComponentAtNode } from 'react-dom'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import PropTypes from 'prop-types'
import { Mask, Container, Title, CloseIcon } from './style'

const PopUp = ({ zIndex, show, title, onClose, content, ...rest }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (show) {
      containerRef.current.style.transform = 'translate(0, 0)'
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  const onMaskClick = (e) => {
    e.stopPropagation()

    if (e.target.className.includes('component-overlay') && typeof show === 'undefined') {
      containerRef.current.style.transform = ''
      unmountComponentAtNode(e.target)
      e.target.remove()
    }
  }

  const getContent = () => {
    if (content) {
      return content
    }

    return rest.children
  }

  const onClickClose = (e) => {
    e.stopPropagation()

    onClose()
  }

  if (!show) {
    return null
  }

  return createPortal(
    <Mask zIndex={zIndex} onClick={onMaskClick} className="component-overlay">
      <Container {...rest} ref={containerRef}>
        <Title>
          {title}
          <CloseIcon onClick={onClickClose}>
            <AiOutlineCloseCircle />
          </CloseIcon>
        </Title>
        {getContent()}
      </Container>
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
  show: undefined,
}

PopUp.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  round: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  zIndex: PropTypes.number,
  show: PropTypes.bool,
}

export default PopUp
