interface Props extends React.SVGAttributes<SVGElement> {
  color?: string
}

function ArrowForwardIcon({ color = '#D1D6DA', ...props }: Props) {
  return (
    <svg {...props} width="7" height="10" viewBox="0 0 7 10" fill="none">
      <path
        d="M1.92247 9.75581L6.67831 4.99997L1.92247 0.244141L0.744141 1.42247L4.32164 4.99997L0.744141 8.57747L1.92247 9.75581Z"
        fill={color}
      />
    </svg>
  )
}

export default ArrowForwardIcon
