import { dismissQuest, QuestAssignment } from "./quest"

test("dismissQuest", () => {
  const obj: QuestAssignment = {
    questId: 0,
  }

  const ret = dismissQuest(obj)

  expect('questId' in ret).toBeFalsy()
})
