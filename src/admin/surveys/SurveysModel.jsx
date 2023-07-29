function surveyModel(item) {
    return {
        id: 0,
        title: item?.title ?? '',
        description: item?.description ?? '',
        content: '',
        type: item?.type ?? '',
        courseId: item?.courseId ?? null,
        active: item?.active ?? false
    }
}

function questionModel(item) {
    return {
        id: 0,
        title: item?.title ?? '',
        content: item?.description ?? '',
        answers: []
    }
}

export { surveyModel, questionModel }