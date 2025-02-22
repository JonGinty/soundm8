import './App.css'
import {
  AppShell,
  MantineProvider,
  Burger,
  Group,
  Text,
} from '@mantine/core'
import { useClickableToggle } from './utils/useToggle'
import HeaderLogo from './components/Logo/HeaderLogo'
import {
  Route,
  Routes,
  HashRouter,
} from 'react-router-dom'
import TextGameStartPage from './components/TextGame/TextGameStartPage'
import SimpleNavLink from './components/SimpleNavLink'
import HomePage from './components/HomePage'

function App() {
  const [opened, toggle] = useClickableToggle()

  return (
    <>
      <MantineProvider defaultColorScheme="light">
        <HashRouter>
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header>
              <Group px={'md'} style={{ height: '100%' }}>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <HeaderLogo />
              </Group>
            </AppShell.Header>
            <AppShell.Main>
              <Routes>
                <Route path="/" element={<HomePage></HomePage>} />
                <Route
                  path="/TextGame"
                  element={<TextGameStartPage></TextGameStartPage>}
                />
                <Route
                  path="/AudioGame"
                  element={
                    <Text>OK, you got me, this one doesn't exist yet!</Text>
                  }
                ></Route>
              </Routes>
            </AppShell.Main>
            <AppShell.Navbar p="md">
              <SimpleNavLink to="/" label="Home" />
              <SimpleNavLink to="/TextGame" label="TextGame" />
              <SimpleNavLink to="/AudioGame" label="AudioGame" />
            </AppShell.Navbar>
          </AppShell>
        </HashRouter>
      </MantineProvider>
    </>
  )
}

export default App
