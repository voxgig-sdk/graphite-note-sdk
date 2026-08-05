package core

type GraphiteNoteError struct {
	IsGraphiteNoteError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewGraphiteNoteError(code string, msg string, ctx *Context) *GraphiteNoteError {
	return &GraphiteNoteError{
		IsGraphiteNoteError: true,
		Sdk:              "GraphiteNote",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *GraphiteNoteError) Error() string {
	return e.Msg
}
