import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import loadable from '@loadable/component'

const Layout = loadable(() => import('./layout/Layout'))
const Projects = loadable(() => import('./pages/Projects'))
const ProjectCreate = loadable(() => import('./pages/Projects/ProjectCreate'))
const ProjectView = loadable(() => import('./pages/Projects/ProjectView'))
const ProjectAddEnvironment = loadable(
  () => import('./pages/Projects/ProjectAddEnvironment')
)

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/projects" replace={true} />} />
          <Route path="projects">
            <Route path="create/:type" element={<ProjectCreate />} />
            <Route path=":rowKey" element={<ProjectView />} />
            <Route
              path=":rowKey/add-environment"
              element={<ProjectAddEnvironment />}
            />
            <Route
              path=":rowKey/add-environment/env=:env"
              element={<ProjectAddEnvironment />}
            />
            <Route index element={<Projects />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
