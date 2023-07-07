

const Message = ({children, variant, marginTop}) => {
  return (
    <div className={`bg-${variant}-subtle px-4 py-2 rounded ${marginTop} text-${variant}`}>
        {children}
    </div>
  )
}

Message.defaultProps = {
  variant: 'danger',
  marginTop: 'mt-5'
}

export default Message