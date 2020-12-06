import {EntityManager} from "typeorm";
import {User} from "@entity/user/User.entity";

export default async function (user: User, foreman: User, em: EntityManager) {
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
}

