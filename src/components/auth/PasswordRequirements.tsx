'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box, Stack, Typography } from '@mui/material';
import { passwordRequirements } from '../../auth/password-policy';

export function PasswordRequirements({ password, visible }: { password: string; visible: boolean }) {
  if (!visible) return null;

  return (
    <Box aria-live="polite" sx={{ px: 0.5, mt: -1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        Password requirements
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 2, rowGap: 0.5 }}>
        {passwordRequirements.map((requirement) => {
          const met = requirement.test(password);
          return (
            <Stack key={requirement.label} direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
              {met ? (
                <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main' }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
              )}
              <Typography variant="caption" sx={{ color: met ? 'success.main' : 'text.secondary' }}>
                {requirement.label}
              </Typography>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}
