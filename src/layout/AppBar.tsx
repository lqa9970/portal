import AppBar from '@mui/material/AppBar'
import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Menu,
  MenuItem,
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { useAccount, useMsal } from '@azure/msal-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import getApplicationConfiguration from '@api/applicationConfiguration'

export default function NCAppBar() {
  const { instance } = useMsal()
  const account = useAccount()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = () => {
    setAnchorEl(null)
    instance.logoutRedirect()
  }

  const { data } = useQuery(
    ['getApplicationConfiguration'],
    getApplicationConfiguration
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar variant="dense" sx={{ px: '0 !important' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 500 }}
            >
              {data?.title}
            </Typography>
            {account && (
              <Box alignItems="center" display="flex">
                <Typography>{account.name}</Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}
