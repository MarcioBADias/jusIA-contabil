export const initialUploadState = {
  file: null,
  uploading: false,
  error: null,
  uploadedFile: null,
}

export function uploadReducer(state, action) {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.payload, error: null }
    case 'SET_UPLOADING':
      return { ...state, uploading: action.payload }
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        uploading: false,
        uploadedFile: action.payload,
        error: null,
      }
    case 'UPLOAD_ERROR':
      return { ...state, uploading: false, error: action.payload }
    case 'RESET_UPLOAD':
      return initialUploadState
    default:
      return state
  }
}
