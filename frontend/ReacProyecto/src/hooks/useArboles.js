import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import services from '../services/services';

/**
 * Custom Hook for Trees management using TanStack Query.
 */
export const useArboles = () => {
  const queryClient = useQueryClient();

  // 1. Fetching Data
  const { 
    data: arboles = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['arboles'],
    queryFn: services.getArboles,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // 2. Create Mutation
  const createArbol = useMutation({
    mutationFn: services.postArboles,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['arboles'] });
    }
  });

  // 3. Update Mutation
  const updateArbol = useMutation({
    mutationFn: ({ arbol, id }) => services.putArboles(arbol, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arboles'] });
    }
  });

  // 4. Delete Mutation
  const deleteArbol = useMutation({
    mutationFn: services.deleteArboles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arboles'] });
    }
  });

  return {
    arboles,
    isLoading,
    isError,
    error,
    refetch,
    createArbol,
    updateArbol,
    deleteArbol
  };
};
