// src/reducers/uploadReducer.js
export const initialUploadState = {
  file: null,
  fileName: '', // Adicionei fileName aqui para consistência com o hook
  uploading: false,
  uploadProgress: 0, // Adicionei uploadProgress aqui
  error: null,
  uploadedFileRecord: null, // Mudei de uploadedFile para uploadedFileRecord para consistência
}

export function uploadReducer(state, action) {
  switch (action.type) {
    case 'SELECT_FILE':
      // Garante que o estado de erro e upload anterior sejam limpos ao selecionar um novo arquivo
      return {
        ...state,
        file: action.payload,
        fileName: action.payload ? action.payload.name : '',
        error: null,
        uploadedFileRecord: null,
        uploadProgress: 0,
      }
    case 'SET_UPLOADING':
      return { ...state, uploading: action.payload }
    case 'SET_UPLOAD_PROGRESS': // NOVO: Adicionado para gerenciar o progresso
      return { ...state, uploadProgress: action.payload }
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        uploading: false,
        uploadedFileRecord: action.payload, // Mudei de uploadedFile para uploadedFileRecord
        error: null,
        uploadProgress: 100, // Completa o progresso no sucesso
      }
    case 'UPLOAD_FAIL': // CORRIGIDO: Mudei de 'UPLOAD_ERROR' para 'UPLOAD_FAIL' para corresponder ao hook
      return {
        ...state,
        uploading: false,
        error: action.payload,
        uploadProgress: 0,
      }
    case 'RESET_UPLOAD':
      return initialUploadState
    default:
      return state
  }
}
