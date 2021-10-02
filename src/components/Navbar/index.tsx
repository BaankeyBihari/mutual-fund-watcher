import * as React from "react"

import PortfolioIcon from "@mui/icons-material/BarChart"
import MFBookMarkIcon from "@mui/icons-material/Bookmarks"
import CompareIcon from "@mui/icons-material/CompareArrows"
import HomeIcon from "@mui/icons-material/Home"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import MFBrowseIcon from "@mui/icons-material/LibraryBooks"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Fab from "@mui/material/Fab"
import Fade from "@mui/material/Fade"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { useTheme } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import Zoom from "@mui/material/Zoom"
import Link from "next/link"

interface Props {
  children: React.ReactElement
  currentItem: string
}

function ScrollTop(props: Props) {
  const { children } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    // target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor")

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  )
}

/*
 * Menu Items(NavMenuItems): (key, href, displayName, Icon)
 */

const NavMenuItems = [
  {
    key: "home",
    href: "/",
    displayName: "HOME",
    Icon: <HomeIcon />,
  },
  {
    key: "portfolio",
    href: "/portfolio",
    displayName: "Portfolio",
    Icon: <PortfolioIcon />,
  },
  {
    key: "bookmarks",
    href: "/bookmarks",
    displayName: "Bookmarks",
    Icon: <MFBookMarkIcon />,
  },
  {
    key: "compare",
    href: "/compare",
    displayName: "Compare",
    Icon: <CompareIcon />,
  },
  {
    key: "browse",
    href: "/browse",
    displayName: "Browse",
    Icon: <MFBrowseIcon />,
  },
]

export default function BackToTop(props: Props) {
  const theme = useTheme()
  const { currentItem } = props
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <React.Fragment>
      <AppBar style={{ background: "#2E3B55" }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" component="div">
              Mutual Funds Tracker
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  id="fade-button"
                  aria-controls="fade-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  style={{ marginLeft: "auto" }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {NavMenuItems.map((e) => {
                    return (
                      <Link
                        href={e.href}
                        key={`navBarCollapse-${e.key}`}
                        passHref
                      >
                        <MenuItem onClick={handleClose}>
                          <>
                            <ListItemIcon>{e.Icon}</ListItemIcon>
                            <Typography variant="h6">
                              {e.displayName}
                            </Typography>
                          </>
                        </MenuItem>
                      </Link>
                    )
                  })}
                </Menu>
              </>
            ) : (
              <div
                style={{
                  marginLeft: "auto",
                }}
              >
                {NavMenuItems.map((e) => {
                  return (
                    <Link
                      href={e.href}
                      key={`navBarExpanded-${e.key}`}
                      passHref
                    >
                      <Button
                        variant="outlined"
                        color={e.key === currentItem ? "inherit" : "primary"}
                      >
                        {e.Icon}
                        {e.displayName}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  )
}
