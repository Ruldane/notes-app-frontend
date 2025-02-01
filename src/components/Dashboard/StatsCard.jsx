import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "rgba(45, 45, 60, 0.95)",
  backdropFilter: "blur(10px)",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.17)",
  color: "#fff",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    fontSize: 40,
    marginRight: theme.spacing(2),
    opacity: 0.8,
  },
}));

const StatsCard = ({ title, value, description, icon: Icon, color }) => {
  return (
    <StyledCard>
      <CardContent>
        <IconWrapper>
          <Icon color={color} />
          <Box>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ color: `${color}.main` }}>
              {value}
            </Typography>
          </Box>
        </IconWrapper>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {description}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default StatsCard;
