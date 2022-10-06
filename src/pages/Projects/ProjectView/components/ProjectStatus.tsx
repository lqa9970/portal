import { Cached, Check } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { ProjectItemStatus } from '@utils/types'
import getProjectStatus from '@api/projects/getProjectStatus'

function getHelperTextFromState(status: ProjectItemStatus) {
  switch (status) {
    case 'success':
      return 'Finished successfully'
    case 'pending':
      return 'In progress'
    case 'queued':
      return 'Not started'
    case 'failure':
      return ''
  }
}

type Props = {
  handleClose: () => void
  open: boolean
}
type Params = {
  projectId: string
}

const ProjectStatus = ({ handleClose, open }: Props) => {
  const { projectId } = useParams() as Params
  const { data, status } = useQuery(['getProjectStatus', projectId], () =>
    getProjectStatus(projectId)
  )
  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="project-status-title"
      aria-describedby="project-status-description"
    >
      <DialogTitle id="project-status-title">{'Project status'}</DialogTitle>
      <DialogContent>
        {status === 'success' && (
          <List>
            {data.map(({ label, status }, index) => (
              <ListItem key={label}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: status === 'queued' ? null : 'primary.main',
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box alignItems="center" gap={4} display="flex">
                      {label}
                      {status === 'success' && <Check color="success" />}
                      {status === 'pending' && <Cached />}
                    </Box>
                  }
                  secondary={getHelperTextFromState(status)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProjectStatus
