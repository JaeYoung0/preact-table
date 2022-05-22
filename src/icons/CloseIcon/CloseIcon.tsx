interface Props {
  width?: number
  height?: number
}

function CloseIcon({ width = 8, height = 8 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.79465 0.22937L3.96598 3.05737L1.13798 0.22937L0.195312 1.17204L3.02331 4.00004L0.195312 6.82804L1.13798 7.7707L3.96598 4.9427L6.79465 7.7707L7.73731 6.82804L4.90931 4.00004L7.73731 1.17204L6.79465 0.22937Z"
        fill="#D1D6DA"
      />
    </svg>
  )
}

export default CloseIcon
