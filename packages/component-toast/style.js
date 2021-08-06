import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999;
`

export const ToastContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  margin-top: -60px;
  margin-left: -60px;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  -webkit-font-smoothing: antialiased;
`

export const IconContainer = styled.div`
  width: 46px;
  height: 46px;
  margin: 0 auto;
  font-size: 46px;
  text-align: center;
`

export const IconSpinContainer = styled.div`
  width: 46px;
  height: 46px;
  margin: 0 auto;
  font-size: 46px;
  text-align: center;
  animation: ${rotate} 1s linear infinite;
`

export const Text = styled.p`
  margin-top: 12px;
  text-align: center;
`
