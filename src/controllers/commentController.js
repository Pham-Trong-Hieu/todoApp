import * as commentService from "../services/commentService";
export const handleAddComment = async (req, res) => {
    const { content, taskid} = req.body;
    if (!content || !taskid ) {
        return res.status(400).json({ message: "missing params" });
    }
    try {
        const result = await commentService.addComment(content, taskid);
        return res.status(200).json({
        data: result,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    };

   