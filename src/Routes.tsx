import ProjectAddEnvironment from '@pages/Projects/ProjectAddEnvironment'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import Projects from './pages/Projects'
import ProjectCreate from './pages/Projects/ProjectCreate'
import ProjectView from './pages/Projects/ProjectView'

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
            <Route index element={<Projects />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
