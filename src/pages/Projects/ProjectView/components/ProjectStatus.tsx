import { Cached, Check, ErrorOutline } from '@mui/icons-material'
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
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { ProjectStatus as ProjectStatusType } from '@utils/types'
import { getProjectStatus } from '@api'

function getHelperTextFromStatus(status: ProjectStatusType) {
  switch (status) {
    case 'Completed':
      return 'Finished successfully'
    case 'In Progress':
      return 'In progress'
    case 'In Queue':
      return 'Not started'
    case 'Error':
      return 'Failed to run this process'
  }
}

function getIconFromStatus(status: ProjectStatusType) {
  switch (status) {
    case 'Error':
      return <ErrorOutline color="error" />
    case 'In Progress':
      return <Cached />
    case 'Completed':
      return <Check color="success" />
  }
}

type Props = {
  handleClose: () => void
  open: boolean
}
type Params = {
  rowKey: string
}

const ProjectStatus = ({ handleClose, open }: Props) => {
  const { rowKey } = useParams() as Params
  const { data, isLoading, isRefetching, isSuccess, refetch } = useQuery(
    ['getProjectStatus', rowKey],
    () => getProjectStatus(rowKey),
    {
      select: (data) =>
        data.sort((a, b) => parseInt(a.orderId) - parseInt(b.orderId)),
    }
  )
  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="project-status-title"
      aria-describedby="project-status-description"
    >
      <DialogTitle id="project-status-title">
        <Box display="flex" gap={1} alignItems="center">
          Project status {(isLoading || isRefetching) && <Cached />}
        </Box>
      </DialogTitle>
      <DialogContent>
        {isSuccess && data.length > 0 && (
          <List>
            {data.map(({ rowKey, subItem, subItemStatus }, index) => (
              <ListItem key={rowKey}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor:
                        subItemStatus === 'In Queue' ? null : 'primary.main',
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box alignItems="center" gap={4} display="flex">
                      {subItem}
                      {getIconFromStatus(subItemStatus)}
                    </Box>
                  }
                  secondary={getHelperTextFromStatus(subItemStatus)}
                />
              </ListItem>
            ))}
          </List>
        )}
        {isSuccess && data.length === 0 && (
          <Typography>
            Process not yet started, try again in few minutes
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => refetch()}>
          Retry
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProjectStatus
