export const CATEGORIES = [
  { value: 'Bird', label: 'Bird', emoji: '🐦', color: '#38BDF8' },
  { value: 'Mammal', label: 'Mammal', emoji: '🦊', color: '#FBBF24' },
  { value: 'Reptile', label: 'Reptile', emoji: '🦎', color: '#34D399' },
  { value: 'Amphibian', label: 'Amphibian', emoji: '🐸', color: '#A855F7' },
  { value: 'Insect', label: 'Insect', emoji: '🦋', color: '#FB7185' },
  { value: 'Fish', label: 'Fish', emoji: '🐟', color: '#22D3EE' },
  { value: 'Other', label: 'Other', emoji: '🌿', color: '#8B9DC3' },
];

export const getCategoryBadge = (category) => {
  return `badge badge-${category?.toLowerCase() || 'other'}`;
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (dateStr) => {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};
