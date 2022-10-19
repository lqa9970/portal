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
import i18n from '@utils/locales/i18n'
import { useTranslation } from 'react-i18next'

function getHelperTextFromStatus(status: ProjectStatusType) {
  const { t } = i18n
  switch (status) {
    case 'Completed':
      return t('finished.successfully') as string
    case 'In Progress':
      return t('in.progress') as string
    case 'In Queue':
      return t('in.queue') as string
    case 'Error':
      return t('failed.to.run.this.process') as string
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
  const { t } = useTranslation()
  const { rowKey } = useParams() as Params
  const { data, isLoading, isRefetching, isSuccess, refetch } = useQuery(
    ['getProjectStatus', rowKey],
    () => getProjectStatus(rowKey),
    {
      select: (data) =>
        data.sort(
          (a, b) =>
            parseInt(a.subItemOrderNumber) - parseInt(b.subItemOrderNumber)
        ),
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
          {t('project.status')} {(isLoading || isRefetching) && <Cached />}
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
          <Typography>{t('project.not.yet.started')}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => refetch()}>
          {t('retry')}
        </Button>
        <Button onClick={handleClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProjectStatus
