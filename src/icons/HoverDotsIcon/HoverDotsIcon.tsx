function HoverDotsIcon({ ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="6" cy="4" r="1" fill="#D1D6DA" />
      <circle cx="10" cy="4" r="1" fill="#D1D6DA" />
      <circle cx="6" cy="8" r="1" fill="#D1D6DA" />
      <circle cx="10" cy="8" r="1" fill="#D1D6DA" />
      <circle cx="6" cy="12" r="1" fill="#D1D6DA" />
      <circle cx="10" cy="12" r="1" fill="#D1D6DA" />
    </svg>
  )
}

export default HoverDotsIcon
