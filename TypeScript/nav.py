from typing import List, Dict

class Question:
    def __init__(self, id: int, content: str, author: str, created_at: int):
        self.id = id
        self.content = content
        self.author = author
        self.vote = 0
        self.deleted = False
        self.last_updated = created_at

class sof:
    def __init__(self, decayTime: int):
        self.decayTime = decayTime
        self.time = 0
        self.questions: Dict[int, Question] = {}
        self.author_map: Dict[str, List[int]] = {}
        self.next_id = 0

    def _decay_votes(self):
        for q in self.questions.values():
            if not q.deleted and self.time - q.last_updated >= self.decayTime:
                q.vote -= 1
                q.last_updated = self.time

    def addQuestion(self, content: str, author: str) -> int:
        self._decay_votes()
        qid = self.next_id
        question = Question(qid, content, author, self.time)
        self.questions[qid] = question
        if author not in self.author_map:
            self.author_map[author] = []
        self.author_map[author].append(qid)
        self.next_id += 1
        print(f"Question with id: {qid} is added")
        self.time += 1
        return qid

    def deleteQuestion(self, id: int):
        self._decay_votes()
        if id in self.questions and not self.questions[id].deleted:
            self.questions[id].deleted = True
            print(f"Question with id: {id} is deleted")
        self.time += 1

    def upVote(self, id: int):
        self._decay_votes()
        if id in self.questions and not self.questions[id].deleted:
            self.questions[id].vote += 1
            self.questions[id].last_updated = self.time
            print(f"Question with id: {id} is upvoted")
        self.time += 1

    def downVote(self, id: int):
        self._decay_votes()
        if id in self.questions and not self.questions[id].deleted:
            self.questions[id].vote -= 1
            self.questions[id].last_updated = self.time
            print(f"Question with id: {id} is downvoted")
        self.time += 1

    def getQuestionById(self, id: int):
        self._decay_votes()
        if id in self.questions and not self.questions[id].deleted:
            q = self.questions[id]
            print(f"Content: {q.content}, Vote: {q.vote}")
        else:
            print("Content: null, Vote: 0")
        self.time += 1

    def getTop10QuestionsByAuthor(self, author: str):
        self._decay_votes()
        if author not in self.author_map:
            self.time += 1
            return
        questions = [self.questions[qid] for qid in self.author_map[author] if not self.questions[qid].deleted]
        questions.sort(key=lambda q: -q.vote)
        top10 = [q.content for q in questions[:10]]
        for q in top10:
            print(q)
        self.time += 1

# ----------------------------
# Generalized Input Handler
# ----------------------------
if __name__ == "__main__":
    import sys

    input_lines = sys.stdin.read().strip().split("\n")
    Q, decayTime = map(int, input_lines[0].split())
    platform = sof(decayTime)

    for i in range(1, Q + 1):
        parts = input_lines[i].split()
        cmd = int(parts[0])

        if cmd == 1:
            content = parts[1]
            author = parts[2]
            platform.addQuestion(content, author)
        elif cmd == 2:
            qid = int(parts[1])
            platform.deleteQuestion(qid)
        elif cmd == 3:
            qid = int(parts[1])
            platform.upVote(qid)
        elif cmd == 4:
            qid = int(parts[1])
            platform.downVote(qid)
        elif cmd == 5:
            qid = int(parts[1])
            platform.getQuestionById(qid)
        elif cmd == 6:
            author = parts[1]
            platform.getTop10QuestionsByAuthor(author)