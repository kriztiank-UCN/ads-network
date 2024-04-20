// recieve singleAd as a prop from parent component
const Sold = ({ singleAd }) => {
  return (
    <div
      style={{
        zIndex: 1,
        width: '50px',
        height: '25px',
        position: 'absolute',
        top: 0,
        // if singleAd is true, set left to 12, else set it to 0
        left: singleAd ? 12 : 0,
        borderRadius: '3px',
      }}
      className='text-white text-center bg-danger'
    >
      Sold
    </div>
  )
}

export default Sold
