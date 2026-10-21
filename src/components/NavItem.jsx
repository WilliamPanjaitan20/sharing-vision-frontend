export function NavItem({ active, icon, children, onClick }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span>{children}</span>
    </button>
  )
}
