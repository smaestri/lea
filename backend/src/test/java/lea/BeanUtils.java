package lea;

import org.springframework.context.ApplicationContext;

import java.util.Arrays;

public class BeanUtils {

    public static void logBeans(ApplicationContext appContext) {
        String[] beans = appContext.getBeanDefinitionNames();
        Arrays.sort(beans);
        System.out.println("************************* BEANS **************************************");
        System.out.println("***************************************************************");
        for (String bean : beans) {
            System.out.println(bean);
        }
        System.out.println("***************************************************************");
    }
}
