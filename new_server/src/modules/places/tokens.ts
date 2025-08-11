// Centralized DI tokens to avoid circular imports
export const PlacesProvider = {
  placeRepository: 'PlaceRepository',
  createPlaceUseCase: 'CreatePlaceUseCase',
  findAllPlacesUseCase: 'FindAllPlacesUseCase',
  findPlaceByIdUseCase: 'FindPlaceByIdUseCase',
  searchPlacesUseCase: 'SearchPlacesUseCase',
  getRandomPlacesUseCase: 'GetRandomPlacesUseCase',
  ensurePlaceUseCase: 'EnsurePlaceUseCase',
  updatePlaceUseCase: 'UpdatePlaceUseCase',
  softDeletePlaceUseCase: 'SoftDeletePlaceUseCase',
  processChatUseCase: 'ProcessChatUseCase',
  getChatHistoryUseCase: 'GetChatHistoryUseCase',
  getChatSessionUseCase: 'GetChatSessionUseCase'
};

// Legacy tokens for backward compatibility
export const PLACE_REPOSITORY = PlacesProvider.placeRepository;
export const CREATE_PLACE_USE_CASE = PlacesProvider.createPlaceUseCase;
export const FIND_ALL_PLACES_USE_CASE = PlacesProvider.findAllPlacesUseCase;
export const FIND_PLACE_BY_ID_USE_CASE = PlacesProvider.findPlaceByIdUseCase;
export const SEARCH_PLACES_USE_CASE = PlacesProvider.searchPlacesUseCase;
export const GET_RANDOM_PLACES_USE_CASE = PlacesProvider.getRandomPlacesUseCase;
export const ENSURE_PLACE_USE_CASE = PlacesProvider.ensurePlaceUseCase;
export const UPDATE_PLACE_USE_CASE = PlacesProvider.updatePlaceUseCase;
export const SOFT_DELETE_PLACE_USE_CASE = PlacesProvider.softDeletePlaceUseCase;
export const PROCESS_CHAT_USE_CASE = PlacesProvider.processChatUseCase;
export const GET_CHAT_HISTORY_USE_CASE = PlacesProvider.getChatHistoryUseCase;
export const GET_CHAT_SESSION_USE_CASE = PlacesProvider.getChatSessionUseCase;
