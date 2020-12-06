import {EntityManager, getManager} from "typeorm";
import {User} from "@entity/user/User.entity";
import context from "@/context/context";

export default async function (user: User, foreman: User, em?: EntityManager) {
  em= em || context.em || getManager()

  // decrease ranks for old relations
  await em.query(`
    update users 
        set rank= rank- ${user.rank}
    WHERE 
        id IN (SELECT id_ancestor FROM users_closure WHERE id_descendant = ${user.id})
        AND id <> ${user.id};
  `)

  // remove old relations
  await em.query(`
    DELETE 
        FROM users_closure
    WHERE 
        id_descendant IN (SELECT id_descendant FROM users_closure WHERE id_ancestor = ${user.id})
        AND id_ancestor NOT IN (SELECT id_descendant FROM users_closure WHERE id_ancestor = ${user.id});
  `)

  user.foreman = foreman
  await em.save(user)

  // create new relations
  if (foreman) {
    await em.query(`
    INSERT INTO 
      users_closure (id_ancestor, id_descendant)
    SELECT 
      supertree.id_ancestor, 
      subtree.id_descendant
    FROM 
      users_closure AS supertree, 
      users_closure AS subtree
    WHERE 
      subtree.id_ancestor = ${user.id}
      AND supertree.id_descendant = ${foreman.id}
  `)

    // increase ranks for new relations
    await em.query(`
    update users
        set rank= rank+ ${user.rank}
    WHERE 
        id IN (SELECT id_ancestor FROM users_closure WHERE id_descendant = ${user.id})
        AND id <> ${user.id};
  `)
  }
}

